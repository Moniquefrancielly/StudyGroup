import { router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { iniciarChamada, encerrarChamada, buscarChamadaAtiva } from "../services/rankingService";

export default function Chamada() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleIniciar = async () => {
    setLoading("iniciar");
    try {
      // ✅ Envia groupId e abre a roomUrl do Jitsi retornada pelo backend
      const res = await iniciarChamada(groupContext.groupId);
      const roomUrl = res.roomUrl;
      if (roomUrl) {
        await Linking.openURL(roomUrl);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível iniciar a chamada. Tente novamente!");
    } finally {
      setLoading(null);
    }
  };

  const handleEntrar = async () => {
    setLoading("entrar");
    try {
      // ✅ Busca chamada ativa do grupo pelo groupId
      const res = await buscarChamadaAtiva(groupContext.groupId);
      const roomUrl = res.roomUrl;
      if (roomUrl) {
        await Linking.openURL(roomUrl);
      } else {
        Alert.alert("Aviso", "Nenhuma chamada ativa no momento.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível entrar na chamada. Tente novamente!");
    } finally {
      setLoading(null);
    }
  };

  const handleEncerrar = async () => {
    Alert.alert(
      "Encerrar chamada",
      "Tem certeza que deseja encerrar a chamada?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Encerrar",
          style: "destructive",
          onPress: async () => {
            setLoading("encerrar");
            try {
              // ✅ Envia groupId ao encerrar
              await encerrarChamada(groupContext.groupId);
              Alert.alert("Sucesso", "Chamada encerrada!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível encerrar a chamada. Tente novamente!");
            } finally {
              setLoading(null);
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
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 30 }}>
        Chamada 📞
      </Text>
      <View style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 25 }}>
        <Text style={{ color: "#ccc", textAlign: "center" }}>
          Nenhuma chamada ativa no momento.
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleIniciar}
        disabled={loading !== null}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12, marginBottom: 15 }}
      >
        {loading === "iniciar" ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>📞 Iniciar Ligação</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleEntrar}
        disabled={loading !== null}
        style={{ backgroundColor: "#2ECC71", padding: 15, borderRadius: 12, marginBottom: 15 }}
      >
        {loading === "entrar" ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>🎥 Entrar na Ligação</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleEncerrar}
        disabled={loading !== null}
        style={{ backgroundColor: "#E74C3C", padding: 15, borderRadius: 12 }}
      >
        {loading === "encerrar" ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>📵 Encerrar Ligação</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
