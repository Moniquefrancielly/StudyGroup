import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { listarMembros, removerMembro } from "../services/groupService";

export default function RemoverMembro() {
  const [membros, setMembros] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [removendo, setRemovendо] = useState(false);

  useFocusEffect(
    useCallback(() => {
    carregarMembros();
   }, [])
  );

  const carregarMembros = async () => {
    setLoading(true);
    try {
      // ✅ Usa o service com o groupId correto
      const dados = await listarMembros(groupContext.groupId);
      setMembros(dados);
    } catch (error) {
      setMembros([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemover = async () => {
    if (!selecionado) {
      Alert.alert("Erro", "Selecione um membro para remover!");
      return;
    }
    Alert.alert(
      "Confirmar remoção",
      "Tem certeza que deseja remover este membro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setRemovendо(true);
            try {
              // ✅ groupId e userIdToRemove enviados corretamente
              await removerMembro(groupContext.groupId, selecionado);
              Alert.alert("Sucesso", "Membro removido!", [
                { text: "OK", onPress: () => router.back() }
              ]);
            } catch (error: any) {
              Alert.alert("Ops!", error?.response?.data?.error || "Ação não permitida.");
            } finally {
              setRemovendо(false);
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
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 10 }}>
        Remover Membro ❌
      </Text>
      <Text style={{ color: "#ccc", marginBottom: 20 }}>
        Selecione o membro que deseja remover do grupo.
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : membros.length > 0 ? (
        membros.map((membro: any) => (
          <TouchableOpacity
            key={membro.userId}
            onPress={() => setSelecionado(membro.userId)}
            style={{
              backgroundColor: selecionado === membro.userId ? "#2D4A9F" : "#1D2F6F",
              padding: 20,
              borderRadius: 15,
              marginBottom: 15,
              borderWidth: selecionado === membro.userId ? 2 : 0,
              borderColor: "#4F7CFF"
            }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>👤 {membro.name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        
        <Text style={{ color: "#ccc", textAlign: "center" }}>
          Nenhum membro encontrado.
        </Text>
      )}

      <TouchableOpacity
        onPress={handleRemover}
        disabled={removendo}
        style={{ backgroundColor: "#E74C3C", padding: 15, borderRadius: 12, marginTop: 10 }}
      >
        {removendo ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Remover Selecionado</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
