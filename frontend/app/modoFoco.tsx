import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Esta tela não consome API — o estado é apenas visual/local.
// Em mobile real, silenciar notificações dependeria de permissões do SO.
export default function ModoFoco() {
  const [ativo, setAtivo] = useState(false);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 30 }}>
        Modo Foco 🎯
      </Text>
      <View style={{ backgroundColor: "#1D2F6F", padding: 25, borderRadius: 15, marginBottom: 20 }}>
        <Text style={{ color: "white", fontSize: 18, textAlign: "center", lineHeight: 28 }}>
          {ativo
            ? "Modo foco ativado! Concentre-se nos estudos. 🎯"
            : "Ative o modo foco para silenciar notificações e concentrar-se totalmente nos estudos."}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setAtivo(true)}
        disabled={ativo}
        style={{ backgroundColor: ativo ? "#555" : "#2ECC71", padding: 18, borderRadius: 12, marginBottom: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
          🎯 Ativar Modo Foco
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setAtivo(false)}
        disabled={!ativo}
        style={{ backgroundColor: !ativo ? "#555" : "#E74C3C", padding: 18, borderRadius: 12 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
          ⛔ Desativar Modo Foco
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
