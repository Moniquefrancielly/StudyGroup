import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { recuperarSenha } from "../services/authService";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async () => {
    if (!email) {
      Alert.alert("Erro", "Digite seu email!");
      return;
    }
    setLoading(true);
    try {
      // ✅ Usa o Firebase via authService (sendPasswordResetEmail)
      // Não depende do backend — o Firebase envia o email diretamente
      await recuperarSenha(email);
      Alert.alert("Sucesso", "Email de recuperação enviado!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o email. Verifique e tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1E4D" }}
      contentContainerStyle={{ padding: 20, justifyContent: "center", flexGrow: 1 }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", fontSize: 18, fontWeight: "bold" }}>← Voltar</Text>
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold", textAlign: "center", marginBottom: 30 }}>
        Recuperar Senha 🔐
      </Text>
      <TextInput
        placeholder="Digite seu email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 20 }}
      />
      <TouchableOpacity
        onPress={handleRecuperar}
        disabled={loading}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
            Enviar Link de Recuperação
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
