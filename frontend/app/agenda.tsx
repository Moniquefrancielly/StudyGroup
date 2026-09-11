import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import { groupContext } from "../services/groupContext";
import { listarLembretes, criarLembrete } from "../services/reminderService";

export default function Agenda() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adicionando, setAdicionando] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [diaSelecionado, setDiaSelecionado] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  useFocusEffect(
   useCallback(() => {
    carregarEventos();
  }, [])
);

  const carregarEventos = async () => {
    setLoading(true);
    try {
      const dados = await listarLembretes(groupContext.groupId);
      setEventos(dados);
    } catch (error) {
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionar = async () => {
    if (!titulo || !data || !hora) {
      Alert.alert("Erro", "Preencha o título, a data e a hora!");
      return;
    }
    const [dia, mes, ano] = data.split("/");
    const datetime = `${ano}-${mes}-${dia}T${hora}:00`;

    setAdicionando(true);
    try {
      await criarLembrete(groupContext.groupId, titulo, datetime);
      setTitulo("");
      setData("");
      setHora("");
      setMostrarForm(false);
      carregarEventos();
    } catch (error: any) {
      Alert.alert("Erro", error?.response?.data?.error || "Não foi possível adicionar o evento.");
    } finally {
      setAdicionando(false);
    }
  };

  // Monta os marcadores do calendário
  const marcadores = eventos.reduce((acc: any, evento: any) => {
    const seconds = evento.datetime?._seconds;
    if (seconds) {
      const date = new Date(seconds * 1000).toISOString().split("T")[0];
      acc[date] = { marked: true, dotColor: "#4F7CFF" };
    }
    return acc;
  }, {});

  // Filtra eventos do dia selecionado
  const eventosDoDia = eventos.filter((evento: any) => {
    const seconds = evento.datetime?._seconds;
    if (!seconds || !diaSelecionado) return false;
    const date = new Date(seconds * 1000).toISOString().split("T")[0];
    return date === diaSelecionado;
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
          <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
          Agenda 📅
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" style={{ marginTop: 20 }} />
      ) : (
        <>
          <Calendar
            theme={{
              backgroundColor: "#0B1E4D",
              calendarBackground: "#1D2F6F",
              textSectionTitleColor: "#4F7CFF",
              selectedDayBackgroundColor: "#4F7CFF",
              selectedDayTextColor: "white",
              todayTextColor: "#4F7CFF",
              dayTextColor: "white",
              textDisabledColor: "#555",
              arrowColor: "#4F7CFF",
              monthTextColor: "white",
              indicatorColor: "#4F7CFF",
            }}
            markedDates={{
              ...marcadores,
              ...(diaSelecionado ? {
                [diaSelecionado]: {
                  ...(marcadores[diaSelecionado] || {}),
                  selected: true,
                  selectedColor: "#4F7CFF",
                }
              } : {})
            }}
            onDayPress={(day: any) => setDiaSelecionado(day.dateString)}
          />

          <View style={{ padding: 20 }}>
            {diaSelecionado ? (
              <>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
                  📋 Eventos em {diaSelecionado}
                </Text>
                {eventosDoDia.length > 0 ? (
                  eventosDoDia.map((evento: any) => (
                    <View key={evento.reminderId} style={{ backgroundColor: "#1D2F6F", padding: 15, borderRadius: 12, marginBottom: 10 }}>
                      <Text style={{ color: "white", fontWeight: "bold" }}>{evento.title}</Text>
                      <Text style={{ color: "#ccc", marginTop: 5 }}>
                        {new Date(evento.datetime._seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: "#ccc" }}>Nenhum evento neste dia.</Text>
                )}
              </>
            ) : (
              <Text style={{ color: "#ccc", textAlign: "center" }}>Toque em um dia para ver os eventos.</Text>
            )}

            {mostrarForm && (
              <View style={{ marginTop: 20 }}>
                <TextInput
                  placeholder="Título do evento"
                  placeholderTextColor="#999"
                  value={titulo}
                  onChangeText={setTitulo}
                  maxLength={100}
                  style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 10 }}
                />
                <TextInput
                  placeholder="Data (ex: 10/06/2026)"
                  placeholderTextColor="#999"
                  value={data}
                  onChangeText={setData}
                  style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 10 }}
                />
                <TextInput
                  placeholder="Hora (ex: 14:30)"
                  placeholderTextColor="#999"
                  value={hora}
                  onChangeText={setHora}
                  style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 10 }}
                />
                <TouchableOpacity
                  onPress={handleAdicionar}
                  disabled={adicionando}
                  style={{ backgroundColor: "#2ECC71", padding: 15, borderRadius: 12 }}
                >
                  {adicionando ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Salvar Evento</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setMostrarForm(!mostrarForm)}
              style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12, marginTop: 15 }}
            >
              <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                {mostrarForm ? "Cancelar" : "+ Adicionar Evento"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}
