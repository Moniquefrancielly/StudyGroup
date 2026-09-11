import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { editarGrupo } from "../services/groupService";

export default function EditarGrupo() {
  // ✅ Nome inicial vem do groupContext, não mais fixo "Os Feras"
  const [nome, setNome] = useState(groupContext.groupName);
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome) {
      Alert.alert("Erro", "Digite o nome do grupo!");
      return;
    }
    setLoading(true);
    try {
      // ✅ Usa o service com groupId correto
      await editarGrupo(groupContext.groupId, nome);
      // Atualiza o nome no contexto também
      groupContext.set(groupContext.groupId, nome);
      Alert.alert("Sucesso", "Grupo atualizado!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error:any) {
      Alert.alert("Ops!", error?.response?.data?.error || "Ação não permitida.");
    } finally {
      setLoading(false);
    }
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
        Editar Grupo ✏️
      </Text>
      <TextInput
        placeholder="Nome do Grupo"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 20 }}
      />
      <TouchableOpacity
        onPress={handleSalvar}
        disabled={loading}
        style={{ backgroundColor: "#F39C12", padding: 15, borderRadius: 12 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
