import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { groupContext } from "../services/groupContext";
import { iniciarSessao, encerrarSessao } from "../services/rankingService";
import { useTimer } from "../services/timerContext";


export default function HomeScreen() {
  const { tempo, rodando, sessaoAtiva, setTempo, setRodando, setSessaoAtiva } = useTimer();

  const handleIniciar = async () => {
    console.log("handleIniciar chamado, groupId:", groupContext.groupId);
    try {
      // ✅ Endpoint correto: /session/start com groupId
      await iniciarSessao(groupContext.groupId);
      console.log("sessão iniciada com sucesso");
      setRodando(true);
      setSessaoAtiva(true);
    } catch (error) {
      console.log("erro ao iniciar:", error);
      Alert.alert("Erro", "Não foi possível iniciar a sessão. Tente novamente!");
    }
  };

  const handlePausar = async () => {
    try {
      // ✅ Endpoint correto: /session/stop — backend calcula duração e atualiza ranking
      console.log("parando sessão, groupId:", groupContext.groupId);

      const resultado =await encerrarSessao(groupContext.groupId);
      console.log("resultado:", JSON.stringify(resultado));

      setRodando(false);
      setSessaoAtiva(false);
    } catch (error) {
      console.log("erro ao parar:", error);
      Alert.alert("Erro", "Não foi possível pausar a sessão. Tente novamente!");
    }
  };

  const handleResetar = async () => {
    if (sessaoAtiva) {
      try {
        await encerrarSessao(groupContext.groupId);
      } catch (error) {}
    }
    setTempo(0);
    setRodando(false);
    setSessaoAtiva(false);
  };

  const horas = String(Math.floor(tempo / 3600)).padStart(2, "0");
  const minutos = String(Math.floor((tempo % 3600) / 60)).padStart(2, "0");
  const segundos = String(tempo % 60).padStart(2, "0");

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1E4D", padding: 20 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 30 }}>
        Cronômetro ⏱️
      </Text>
      <View style={{ backgroundColor: "#1D2F6F", borderRadius: 20, padding: 30, alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 40, fontWeight: "bold", marginBottom: 20 }}>
          {horas}:{minutos}:{segundos}
        </Text>
        <TouchableOpacity
          onPress={rodando ? handlePausar : handleIniciar}
          style={{ backgroundColor: "#4F7CFF", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 12 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {rodando ? "Pausar" : "Iniciar"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleResetar}
          style={{ backgroundColor: "#E74C3C", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 12, marginTop: 10 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Resetar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
