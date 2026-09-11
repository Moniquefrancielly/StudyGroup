import { router,  useFocusEffect  } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { groupContext } from "../services/groupContext";
import { detalheResumo, adicionarComentario } from "../services/summaryService";

export default function Comentarios() {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useFocusEffect(
    useCallback(() => {
    carregarComentarios();
   }, [])
  );

  const carregarComentarios = async () => {
    setLoading(true);
    try {
      const dados = await detalheResumo(groupContext.summaryId);
      setComentarios(dados.comments || []);
    } catch (error) {
      setComentarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleComentar = async () => {
    if (!novoComentario) {
      Alert.alert("Erro", "Digite um comentário!");
      return;
    }
    setEnviando(true);
    try {
      await adicionarComentario(groupContext.summaryId, novoComentario);
      setNovoComentario("");
      carregarComentarios();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o comentário. Tente novamente!");
    } finally {
      setEnviando(false);
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
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 25 }}>
        Comentários 💬
      </Text>

      {loading ? (
        <ActivityIndicator color="#4F7CFF" size="large" />
      ) : comentarios.length > 0 ? (
        comentarios.map((comentario: any, index: number) => (
          <View key={comentario.commentId || index} style={{ backgroundColor: "#1D2F6F", padding: 15, borderRadius: 15, marginBottom: 10 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{comentario.authorName}</Text>
            <Text style={{ color: "#ccc", marginTop: 5 }}>{comentario.text}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: "#ccc" }}>
          Nenhum comentário foi feito.
        </Text>
      )}

      <TextInput
        placeholder="Adicionar comentário"
        placeholderTextColor="#999"
        value={novoComentario}
        onChangeText={setNovoComentario}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 15, marginTop: 10 }}
      />
      <TouchableOpacity
        onPress={handleComentar}
        disabled={enviando}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12 }}
      >
        {enviando ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Comentar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
