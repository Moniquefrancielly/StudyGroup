// novoLembrete.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { groupContext } from "../services/groupContext";
import { criarRecado } from "../services/messageService";

export default function NovoLembrete() {
  const [texto, setTexto] = useState("");
  const [temEnquete, setTemEnquete] = useState(false);
  const [opcao1, setOpcao1] = useState("");
  const [opcao2, setOpcao2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!texto.trim()) {
      Alert.alert("Erro", "O texto do recado é obrigatório!");
      return;
    }
    if (temEnquete && (!opcao1.trim() || !opcao2.trim())) {
      Alert.alert("Erro", "Preencha as duas opções da enquete!");
      return;
    }

    setLoading(true);
    try {
      await criarRecado(
        groupContext.groupId,
        texto,
        temEnquete ? { option1: opcao1, option2: opcao2 } : undefined
      );
      Alert.alert("Sucesso", "Recado publicado!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (_error) {
      Alert.alert("Erro", "Não foi possível publicar o recado.");
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
      <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        Novo Recado 📌
      </Text>

      <TextInput
        placeholder="Escreva o recado... (máx. 500 caracteres)"
        placeholderTextColor="#999"
        value={texto}
        onChangeText={(t) => t.length <= 500 && setTexto(t)}
        multiline
        numberOfLines={5}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 8, textAlignVertical: "top", minHeight: 120 }}
      />
      <Text style={{ color: "#999", textAlign: "right", marginBottom: 20 }}>{texto.length}/500</Text>

      {/* Toggle enquete */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1D2F6F", padding: 15, borderRadius: 12, marginBottom: 15 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>📊 Adicionar enquete</Text>
        <Switch
          value={temEnquete}
          onValueChange={setTemEnquete}
          trackColor={{ false: "#555", true: "#4F7CFF" }}
          thumbColor="white"
        />
      </View>

      {temEnquete && (
        <>
          <TextInput
            placeholder="Opção 1 (ex: Às 14h)"
            placeholderTextColor="#999"
            value={opcao1}
            onChangeText={setOpcao1}
            style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 12 }}
          />
          <TextInput
            placeholder="Opção 2 (ex: Às 16h)"
            placeholderTextColor="#999"
            value={opcao2}
            onChangeText={setOpcao2}
            style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 20 }}
          />
        </>
      )}

      <TouchableOpacity
        onPress={handleSalvar}
        disabled={loading}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Publicar Recado</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}