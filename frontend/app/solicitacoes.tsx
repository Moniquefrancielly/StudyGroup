import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { listarSolicitacoes, aprovarSolicitacao, recusarSolicitacao } from "../services/groupService";

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
    carregarSolicitacoes();
   }, [])
  );

  const carregarSolicitacoes = async () => {
    setLoading(true);
    console.log("groupId ao carregar solicitações:", groupContext.groupId);
    try {
      // ✅ Endpoint correto com groupId
      const dados = await listarSolicitacoes(groupContext.groupId);
      setSolicitacoes(dados);
    } catch (error) {
      setSolicitacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAceitar = async (requestId: string) => {
    try {
      // ✅ Endpoint correto: approve-request
      await aprovarSolicitacao(groupContext.groupId, requestId);
      Alert.alert("Sucesso", "Solicitação aceita!");
      carregarSolicitacoes();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível aceitar. Tente novamente!");
    }
  };

  const handleRecusar = async (requestId: string) => {
    try {
      // ✅ Endpoint correto: reject-request
      await recusarSolicitacao(groupContext.groupId, requestId);
      Alert.alert("Sucesso", "Solicitação recusada!");
      carregarSolicitacoes();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível recusar. Tente novamente!");
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
        Solicitações 📥
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : solicitacoes.length > 0 ? (
        solicitacoes.map((solicitacao: any) => (
          <View key={solicitacao.id} style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 15 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
              {solicitacao.userName}
            </Text>
            <Text style={{ color: "#ccc", marginBottom: 15 }}>
              {solicitacao.userEmail}
            </Text>  
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => handleAceitar(solicitacao.requestId)}
                style={{ backgroundColor: "#2ECC71", width: "48%", padding: 12, borderRadius: 10 }}
              >
                <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRecusar(solicitacao.requestId)}
                style={{ backgroundColor: "#E74C3C", width: "48%", padding: 12, borderRadius: 10 }}
              >
                <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Recusar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={{ color: "#ccc", textAlign: "center", marginTop: 20 }}>
          Nenhuma solicitação pendente.
        </Text>
      )}
    </ScrollView>
  );
}