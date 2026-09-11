import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import * as Clipboard from 'expo-clipboard';
import api from "../services/api";
import { groupContext } from "../services/groupContext";

export default function Membros() {
  const [membros, setMembros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
    carregarMembros();
   }, [])
  );

  const carregarMembros = async () => {
    setLoading(true);
    try {
      const groupId = groupContext.groupId;
      // ✅ Endpoint correto com groupId dinâmico
      const res = await api.get(`/group/${groupId}/members`);
      setMembros(res.data);
    } catch (error) {
      setMembros([]);
    } finally {
      setLoading(false);
    }
  };
//    const handleConvidar = async () => {
//    try {
//      const groupId = groupContext.groupId;
//      const res = await api.post("/group/invite", { groupId });
//      alert(`Convite gerado! Código: ${res.data.inviteCode}`);
//    } catch (error) {
//      alert("Não foi possível gerar o convite. Tente novamente!");
//    }
//  };

  const handleConvidar = async () => {
    try {
      const groupId = groupContext.groupId;
      const res = await api.post("/group/invite", { groupId });
      const code = res.data.inviteCode;
      Alert.alert("Convite gerado! 🔗", `Senha de entrada: ${code}`, [
        {text: "Fechar", style: "cancel"},
        {
          text: "Copiar",
          onPress: async ()=> {
           await Clipboard.setStringAsync(code);
            Alert.alert("Copiado para área de transfêrencia.");
          }
        }
      ]
    );    
    } catch (error) {
      console.log("erro convite:", JSON.stringify(error));
      Alert.alert("Erro", "Não foi possível gerar o convite. Tente novamente!");
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
        Membros 👥
      </Text>

    {loading ? (
  <ActivityIndicator color="#4F7CFF" size="large" />
) : membros.length > 0 ? (
  membros.map((membro: any) => (
    <View key={membro.userId} style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 15 }}>
      <Text style={{ color: membro.role === "admin" ? "#FFD700" : "white", fontSize: 18, fontWeight: "bold" }}>
        {membro.role === "admin" ? "👑" : "👤"} {membro.name}
      </Text>
      <Text style={{ color: "#ccc", marginTop: 5 }}>{membro.role === "admin" ? "Administrador" : "Membro"}</Text>
      <Text style={{ color: "#999", marginTop: 3, fontSize: 13 }}>{membro.email}</Text>
    </View>
  ))
) : (
  <Text style={{ color: "#ccc" }}>
    Nenhum membro além do administrador.
  </Text>
)}

      <TouchableOpacity onPress={() => router.push("/solicitacoes")} style={{ backgroundColor: "#9B59B6", padding: 15, borderRadius: 12, marginBottom: 10 }}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>📥 Solicitações</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleConvidar} style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12, marginBottom: 10 }}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>🔗 Gerar Senha de Convite</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/transferirAdm")} style={{ backgroundColor: "#F39C12", padding: 15, borderRadius: 12, marginBottom: 10 }}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>👑 Transferir Administração</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/denunciarUsuario")} style={{ backgroundColor: "#C0392B", padding: 15, borderRadius: 12, marginBottom: 10 }}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>🚨 Denunciar Usuário</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/removerMembro")} style={{ backgroundColor: "#E74C3C", padding: 15, borderRadius: 12 }}>
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>❌ Remover Membro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
