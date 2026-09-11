import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { criarGrupo } from "../services/groupService";

export default function NovoGrupo() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCriarGrupo = async () => {
    if (!nome) {
      Alert.alert("Erro", "Digite o nome do grupo!");
      return;
    }
    setLoading(true);
    try {
      await criarGrupo(nome);
      Alert.alert("Sucesso", "Grupo criado!", [
        { text: "OK", onPress: () => router.push("/grupos") }
      ]);
    } catch (error: any) {
      console.log("Erro ao criar grupo:", JSON.stringify(error?.response?.data));
      console.log("Status:", error?.response?.status);
      Alert.alert("Erro", "Não foi possível criar o grupo. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1, justifyContent: "center" }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 30 }}>
        Criar Grupo 👥
      </Text>
      <TextInput
        placeholder="Nome do Grupo"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Descrição (opcional)"
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={descricao}
        onChangeText={setDescricao}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 20, height: 120, textAlignVertical: "top" }}
      />
      <TouchableOpacity
        onPress={handleCriarGrupo}
        disabled={loading}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Criar Grupo</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
