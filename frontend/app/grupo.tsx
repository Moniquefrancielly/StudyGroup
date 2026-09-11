import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { listarRankingMensal } from "../services/rankingService";

export default function Grupo() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pega o nome do grupo salvo no groupContext
  const nomeDoGrupo = groupContext.groupName || "Meu Grupo";

  useFocusEffect(
    useCallback(() => {
    carregarRanking();
   }, [])
  );

  const carregarRanking = async () => {
    setLoading(true);
    try {
      // ✅ Usa o service com o groupId correto
      const dados = await listarRankingMensal(groupContext.groupId);
      setRanking(dados);
    } catch (error) {
      setRanking([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40, marginBottom: 20 }}>
  <TouchableOpacity onPress={() => router.back()}>
    <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => router.push("/notificacoes")}>
    <Text style={{ fontSize: 24 }}>🔔</Text>
  </TouchableOpacity>
</View>

      {/* ✅ Nome do grupo vem do groupContext, não mais fixo */}
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 25 }}>
        {nomeDoGrupo} 📚
      </Text>

      <View style={{ backgroundColor: "#1D2F6F", borderRadius: 20, padding: 20, marginBottom: 20 }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>🏆 Top 3 do Mês </Text>
        {loading ? (
          <ActivityIndicator color="#4F7CFF" />
        ) : ranking.length > 0 ? (
          ranking.slice(0, 3).map((item: any, index: number) => (
            <Text key={index} style={{ color: index === 0 ? "#FFD700" : "#C0C0C0", marginTop: 5 }}>
              {index === 0 ? "🥇" : "🥈"} {item.userName} — {item.studyTime}
            </Text>
          ))
        ) : (
          <Text style={{ color: "#ccc" }}>
            Nenhum ranking disponível.
          </Text>
        )}
      </View>

      {/* Linha 1 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        <TouchableOpacity onPress={() => router.push("/home")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>⏱️</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Cronômetro</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/resumos")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>📝</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Resumos</Text>
        </TouchableOpacity>
      </View>

      {/* Linha 2 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        <TouchableOpacity onPress={() => router.push("/lembretes")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>📌</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Lembretes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/rankingDiario")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>🏆</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Ranking Dia</Text>
        </TouchableOpacity>
      </View>

      {/* Linha 3 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        <TouchableOpacity onPress={() => router.push("/rankingMensal")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>📊</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Ranking Mês</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/membros")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>👥</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Membros</Text>
        </TouchableOpacity>
      </View>

      {/* Linha 4 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        <TouchableOpacity onPress={() => router.push("/chamada")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>📞</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Chamada</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/perfil")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>👤</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Linha 5 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
        <TouchableOpacity onPress={() => router.push("/agenda")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>📅</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/modoFoco")} style={{ backgroundColor: "#1D2F6F", width: "48%", padding: 25, borderRadius: 15, alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 18 }}>🎯</Text>
          <Text style={{ color: "white", marginTop: 8 }}>Modo Foco</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push("/editarGrupo")} style={{ backgroundColor: "#F39C12", padding: 15, borderRadius: 12, marginBottom: 10, alignItems: "center" }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>✏️ Editar Grupo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/sairGrupo")} style={{ backgroundColor: "#E67E22", padding: 15, borderRadius: 12, marginBottom: 10, alignItems: "center" }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>🚪 Sair do Grupo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/excluirGrupo")} style={{ backgroundColor: "#E74C3C", padding: 15, borderRadius: 12, alignItems: "center" }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>🗑️ Excluir Grupo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
