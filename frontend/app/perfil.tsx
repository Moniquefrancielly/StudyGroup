import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import {signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { groupContext } from "../services/groupContext";
import { listarHistoricoRanking, buscarTempoMensal } from "../services/rankingService";

export default function Perfil() {
  const [perfil, setPerfil] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tempoMensal, setTempoMensal] = useState(0);

  useFocusEffect(
    useCallback(() => {
    carregarPerfil();
   }, [])
  );

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      await auth.currentUser?.reload();
      setPerfil({
        nome: user?.displayName || "Usuário",
        email: user?.email || "",
      });
      
      const dados = await listarHistoricoRanking(groupContext.groupId);
      setHistorico(dados);

      const mensal = await buscarTempoMensal(groupContext.groupId);
      setTempoMensal(mensal.totalTime || 0);
    } catch (error) {
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  };
 
  const handleLogout = () => {
  Alert.alert("Sair", "Deseja sair da sua conta?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Sair",
      style: "destructive",
      onPress: async () => {
        await signOut(auth);
        router.replace("/login");
      }
    }
  ]);
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
        Perfil 👤
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : (
        <>
          <View style={{ backgroundColor: "#1D2F6F", padding: 25, borderRadius: 15, marginBottom: 20 }}>
            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
              {perfil?.nome || "Usuário"}
            </Text>
            <Text style={{ color: "#ccc", marginTop: 8 }}>
              {perfil?.email || ""}
            </Text>
          </View>

          <View style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 15 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>⏱️ Horas estudadas este mês</Text>
            <Text style={{ color: "#4F7CFF", fontSize: 22, marginTop: 10 }}>{Math.floor(tempoMensal / 3600)}h {Math.floor((tempoMensal % 3600) / 60)}min
            </Text>
          </View>

          <View style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 15 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>🏆 Melhor posição</Text>
            <Text style={{ color: "#FFD700", fontSize: 22, marginTop: 10 }}>-</Text>
          </View>

          <View style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 25 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>📈 Histórico de Ranking</Text>
            {historico.length > 0 ? (
              historico.map((item: any, index: number) => (
                <Text key={index} style={{ color: "#ccc", marginTop: 10 }}>
                  {item.month} - {item.position}º Lugar
                </Text>
              ))
            ) : (
              <Text style={{ color: "#ccc", marginTop: 10 }}>
                Nenhum histórico encontrado.
              </Text>
            )}
          </View>
        </>
      )}

      <TouchableOpacity
        onPress={handleLogout}
       style={{ backgroundColor: "#2C3E50", padding: 15, borderRadius: 12, marginBottom: 10 }}
      >
      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>🚪 Sair da Conta</Text>
      </TouchableOpacity>
    
      <TouchableOpacity
        onPress={() => router.push("/editarPerfil")}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12, marginBottom: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Editar Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/excluirConta")}
        style={{ backgroundColor: "#E74C3C", padding: 15, borderRadius: 12 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>🗑️ Excluir Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
