import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { criarResumo } from "../services/summaryService";

export default function NovoResumo() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!titulo || !conteudo) {
      Alert.alert("Erro", "Preencha o título e o conteúdo!");
      return;
    }
    setLoading(true);
    try {
      // ✅ groupId enviado automaticamente via service
      await criarResumo(groupContext.groupId, titulo, conteudo);
      Alert.alert("Sucesso", "Resumo salvo!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o resumo. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        Novo Resumo 📝
      </Text>
      <TextInput
        placeholder="Título"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Digite seu resumo..."
        placeholderTextColor="#999"
        multiline
        value={conteudo}
        onChangeText={setConteudo}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, height: 200, textAlignVertical: "top", marginBottom: 20 }}
      />
      <TouchableOpacity
        onPress={handleSalvar}
        disabled={loading}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Salvar Resumo</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
