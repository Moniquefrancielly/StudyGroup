import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DenunciarUsuario() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 30 }}>
        Denunciar Usuário 🚨
      </Text>

      <View style={{ backgroundColor: "#1D2F6F", padding: 25, borderRadius: 15, alignItems: "center" }}>
        <Text style={{ fontSize: 40, marginBottom: 15 }}>🚧</Text>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 12, textAlign: "center" }}>
          Em desenvolvimento
        </Text>
        <Text style={{ color: "#ccc", textAlign: "center", lineHeight: 22 }}>
          Logo, novas versões do aplicativo contarão com a funcionalidade de denúncias. Quando disponível, os relatos enviados serão analisados pela equipe técnica responsável pela plataforma.
        </Text>
      </View>
    </ScrollView>
  );
}
