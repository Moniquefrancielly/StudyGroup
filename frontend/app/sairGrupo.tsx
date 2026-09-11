import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { sairDoGrupo } from "../services/groupService";

export default function SairGrupo() {
  const [loading, setLoading] = useState(false);

  const handleSair = async () => {
    Alert.alert(
      "Confirmar saída",
      "Tem certeza que deseja sair do grupo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // ✅ Usa o service com groupId correto
              await sairDoGrupo(groupContext.groupId);
              groupContext.clear();
              Alert.alert("Sucesso", "Você saiu do grupo!", [
                { text: "OK", onPress: () => router.push("/grupos") }
              ]);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível sair do grupo. Tente novamente!");
            } finally {
              setLoading(false);
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
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 25 }}>
        Sair do Grupo 🚪
      </Text>
      <View style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 25 }}>
        <Text style={{ color: "#ccc", lineHeight: 24 }}>
          Você deixará de participar deste grupo e perderá acesso aos seus conteúdos.
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleSair}
        disabled={loading}
        style={{ backgroundColor: "#E67E22", padding: 15, borderRadius: 12 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Confirmar Saída</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
