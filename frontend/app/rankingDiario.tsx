import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { listarRankingDiario } from "../services/rankingService";

export default function RankingDiario() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
    carregarRanking();
   }, [])
  );

  const carregarRanking = async () => {
    setLoading(true);
    try {
      // ✅ Endpoint correto com groupId — backend filtra pelo dia
      const dados = await listarRankingDiario(groupContext.groupId);
      setRanking(dados);
    } catch (error) {
      setRanking([]);
    } finally {
      setLoading(false);
    }
  };

  const medalhas = ["🥇", "🥈", "🥉"];
  const cores = ["#FFD700", "#C0C0C0", "#CD7F32"];

  const formatarTempo = (segundos: number) => {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
        Ranking Diário 🏆
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : ranking.length > 0 ? (
        ranking.map((item: any, index: number) => (
          <View key={index} style={{ backgroundColor: "#1D2F6F", borderRadius: 18, padding: 20, marginBottom: 15 }}>
            <Text style={{ color: cores[index] || "white", fontSize: index < 3 ? 22 : 18, fontWeight: "bold" }}>
              {medalhas[index] || `${index + 1}º`} {item.userName}
            </Text>
            <Text style={{ color: index < 3 ? "white" : "#ccc", marginTop: 8, fontSize: index < 3 ? 16 : 14 }}>
              {index < 3 ? "Tempo estudado: " : ""}{formatarTempo(item.totalTime)}
            </Text>
          </View>
        ))
      ) : (
        // Fallback mockado
      <Text style={{ color: "#ccc" }}>
        Nenhum ranking disponível.
      </Text>
      )}
    </ScrollView>
  );
}
