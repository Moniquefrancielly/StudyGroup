import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { login } from "../services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha!");
      return;
    }
    setLoading(true);
    try {
      // ✅ Autentica pelo Firebase via authService — só navega se o login der certo
  const user = await login(email, senha);

  if (!user.emailVerified) {
    Alert.alert(
      "Email não verificado",
      "Verifique o link enviado para seu email antes de entrar."
    );

    return;
  }
  router.push("/grupos");
  
    } catch (error: any) {
      Alert.alert("Erro", "Email ou senha incorretos!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1E4D", justifyContent: "center", padding: 30 }}>
      <Text style={{ color: "white", fontSize: 38, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        StudyGroup 🚀
      </Text>
      <Text style={{ color: "#CCCCCC", textAlign: "center", marginBottom: 40 }}>
        Bem-vindo ao seu grupo de estudos
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 10 }}
      />
      <TouchableOpacity onPress={() => router.push("/recuperarSenha")} style={{ marginBottom: 20 }}>
        <Text style={{ color: "#4F7CFF", textAlign: "right", fontWeight: "bold" }}>
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12, marginBottom: 15 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Entrar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/cadastro")}
        style={{ backgroundColor: "#2D3A68", padding: 15, borderRadius: 12 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}
