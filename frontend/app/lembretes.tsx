// lembretes.tsx
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { groupContext } from "../services/groupContext";
import { auth } from "../services/firebase";
import { listarRecados, votarEnquete, deletarRecado } from "../services/messageService";

export default function Lembretes() {
  const [recados, setRecados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      carregarRecados();
    }, [])
  );

  const carregarRecados = async () => {
    setLoading(true);
    try {
      const dados = await listarRecados(groupContext.groupId);
      setRecados(dados);
    } catch (_error) {
      setRecados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVotar = async (messageId: string, option: string) => {
    try {
      await votarEnquete(messageId, option);
      await carregarRecados();
    } catch (_error) {
      Alert.alert("Erro", "Não foi possível registrar o voto.");
    }
  };

  const handleDeletar = (messageId: string) => {
    Alert.alert("Deletar", "Deseja deletar este recado?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar", style: "destructive",
        onPress: async () => {
          try {
            await deletarRecado(messageId);
            await carregarRecados();
          } catch (_error) {
            Alert.alert("Erro", "Não foi possível deletar.");
          }
        }
      }
    ]);
  };

  const userId = auth.currentUser?.uid;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        Lembretes 📌
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : recados.length > 0 ? (
        recados.map((recado: any) => {
          const aberto = expandido === recado.messageId;
          return (
            <TouchableOpacity
              key={recado.messageId}
              onPress={() => setExpandido(aberto ? null : recado.messageId)}
              style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 15 }}
            >
              {/* Header do recado */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 15, flex: 1 }}>
                  {recado.authorName}
                </Text>
                <Text style={{ color: "#4F7CFF", fontSize: 12 }}>
                  {recado.createdAt?._seconds
                    ? new Date(recado.createdAt._seconds * 1000).toLocaleDateString("pt-BR")
                    : ""}
                </Text>
              </View>

              {/* Preview ou texto completo */}
              <Text style={{ color: "#ccc", marginTop: 8 }} numberOfLines={aberto ? undefined : 2}>
                {recado.text}
              </Text>

              {/* Enquete — só aparece expandido */}
              {aberto && recado.poll && (
                <View style={{ marginTop: 15 }}>
                  <Text style={{ color: "white", fontWeight: "bold", marginBottom: 8 }}>📊 Enquete</Text>
                  {(["option1", "option2"] as const).map((opt) => {
                    const opcao = recado.poll[opt];
                    const jaVotou = opcao.votes.includes(userId);
                    const total = recado.poll.option1.votes.length + recado.poll.option2.votes.length;
                    const pct = total > 0 ? Math.round((opcao.votes.length / total) * 100) : 0;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => handleVotar(recado.messageId, opt)}
                        style={{
                          backgroundColor: jaVotou ? "#4F7CFF" : "#0B1E4D",
                          borderWidth: 1,
                          borderColor: "#4F7CFF",
                          borderRadius: 10,
                          padding: 12,
                          marginBottom: 8,
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <Text style={{ color: "white" }}>{opcao.label}</Text>
                        <Text style={{ color: "#ccc" }}>{opcao.votes.length} voto{opcao.votes.length !== 1 ? "s" : ""} ({pct}%)</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Botão deletar — só autor ou admin */}
              {aberto && (recado.userId === userId || groupContext.adminId === userId) && (
                <TouchableOpacity
                  onPress={() => handleDeletar(recado.messageId)}
                  style={{ marginTop: 12, alignSelf: "flex-end" }}
                >
                  <Text style={{ color: "#E74C3C", fontSize: 13 }}>🗑️ Deletar</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={{ color: "#ccc" }}>Nenhum recado cadastrado.</Text>
      )}

      <TouchableOpacity
        onPress={() => router.push("/novoLembrete")}
        style={{ borderWidth: 1, borderColor: "#4F7CFF", borderStyle: "dashed", padding: 20, borderRadius: 15, marginTop: 10 }}
      >
        <Text style={{ color: "#4F7CFF", textAlign: "center", fontWeight: "bold" }}>+ Adicionar Recado</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
