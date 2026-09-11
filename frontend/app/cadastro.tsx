import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { cadastro } from "../services/authService";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    setLoading(true);
    try {
      // ✅ Cria conta no Firebase via authService
      await cadastro(nome, email, senha);

      Alert.alert(
        "Verifique seu email",
        "Enviamos um link de confirmação para seu email. Verifique antes de fazer login."
      );

      router.replace("/login");

      // Nota: o campo "nome" pode ser salvo futuramente via PUT /auth/update
      // se o backend suportar atualização de displayName
      router.push("/grupos");
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1E4D", justifyContent: "center", padding: 30 }}>
      <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
        Criar Conta ✨
      </Text>
      <Text style={{ color: "#CCCCCC", textAlign: "center", marginBottom: 30 }}>
        Comece sua jornada de estudos
      </Text>
      <TextInput
        placeholder="Nome"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 15 }}
      />
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
        style={{ backgroundColor: "white", borderRadius: 12, padding: 15, marginBottom: 20 }}
      />
      <TouchableOpacity
        onPress={handleCadastro}
        disabled={loading}
        style={{ backgroundColor: "#4F7CFF", padding: 15, borderRadius: 12, marginBottom: 15 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Cadastrar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "#CCCCCC", textAlign: "center" }}>
          Já possui conta? Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
