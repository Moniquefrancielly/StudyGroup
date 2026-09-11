import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { detalheResumo, excluirResumo } from "../services/summaryService";

export default function ResumoDetalhe() {
  const [resumo, setResumo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [excluindo, setExcluindo] = useState(false);

  useFocusEffect(
    useCallback(() => {
    carregarDetalhe();
   }, [])
  );

  const carregarDetalhe = async () => {
    setLoading(true);
    try {
      // ✅ Busca o detalhe do resumo pelo summaryId salvo no groupContext
      const dados = await detalheResumo(groupContext.summaryId);
      setResumo(dados);
    } catch (error) {
      setResumo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    Alert.alert(
      "Excluir resumo",
      "Tem certeza que deseja excluir este resumo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setExcluindo(true);
            try {
              // ✅ Endpoint correto com summaryId
              await excluirResumo(groupContext.summaryId);
              Alert.alert("Sucesso", "Resumo excluído!", [
                { text: "OK", onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o resumo. Tente novamente!");
            } finally {
              setExcluindo(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
        Resumo 📖
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : (
        <View style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 20 }}>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
            {/* ✅ Título vindo da API, fallback mockado */}
            {resumo?.title ?? "Introdução aos Grafos"}
          </Text>
          <Text style={{ color: "#ccc", lineHeight: 22 }}>
            {resumo?.content ?? "Grafos são estruturas compostas por vértices e arestas. São utilizados para modelar redes, mapas, conexões e diversos problemas computacionais."}
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => router.push("/comentarios")}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12, marginBottom: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Ver Comentários</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleExcluir}
        disabled={excluindo}
        style={{ backgroundColor: "#E74C3C", padding: 15, borderRadius: 12, marginTop: 10 }}
      >
        {excluindo ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>🗑️ Excluir Resumo</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
