import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { listarResumos } from "../services/summaryService";

export default function Resumos() {
  const [resumos, setResumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
    carregarResumos();
   }, [])
  );
  const carregarResumos = async () => {
    setLoading(true);
    try {
      // ✅ Endpoint correto com groupId
      const dados = await listarResumos(groupContext.groupId);
      setResumos(dados);
    } catch (error) {
      setResumos([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirResumo = (resumo: any) => {
    // ✅ Salva o summaryId antes de navegar, igual ao groupId nos grupos
    groupContext.setSummaryId(resumo.summaryId);
    router.push("/resumoDetalhe");
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
        Resumos 📝
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : resumos.length > 0 ? (
        resumos.map((resumo: any) => (
          <TouchableOpacity
            key={resumo.summaryId}
            onPress={() => abrirResumo(resumo)}
            style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 15 }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{resumo.title}</Text>
            <Text style={{ color: "#ccc", marginTop: 5 }}>Adicionado por {resumo.authorName}</Text>
          </TouchableOpacity>
        ))
      ) : (
        
        <Text style={{ color: "#ccc" }}>
          Nenhum resumo encontrado.
        </Text>
      )}

      <TouchableOpacity
        onPress={() => router.push("/novoResumo")}
        style={{ borderWidth: 1, borderColor: "#4F7CFF", borderStyle: "dashed", padding: 20, borderRadius: 15 }}
      >
        <Text style={{ color: "#4F7CFF", textAlign: "center", fontWeight: "bold" }}>+ Adicionar Resumo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
