import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { excluirConta, logout } from "../services/authService";
import { groupContext } from "../services/groupContext";

export default function ExcluirConta() {
  const [loading, setLoading] = useState(false);

  const handleExcluir = async () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza? Essa ação não pode ser desfeita!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // ✅ Usa o service em vez de chamar api.delete direto
              await excluirConta();
              groupContext.clear();
              await logout();
              router.push("/login");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a conta. Tente novamente!");
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
        Excluir Conta ⚠️
      </Text>
      <View style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 25 }}>
        <Text style={{ color: "#ccc", lineHeight: 24 }}>
          Ao excluir sua conta, todos os seus dados serão removidos permanentemente do sistema.
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleExcluir}
        disabled={loading}
        style={{ backgroundColor: "#E74C3C", padding: 15, borderRadius: 12 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Excluir Minha Conta</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
