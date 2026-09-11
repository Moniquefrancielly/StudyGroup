import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated, Dimensions, ScrollView, Text, TouchableOpacity,
  TouchableWithoutFeedback, View, ActivityIndicator, Alert
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import api from "../services/api";
import { groupContext } from "../services/groupContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

export default function Grupos() {
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useFocusEffect(
    useCallback(() => {
      carregarGrupos();
    }, [])
  );

  const carregarGrupos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/group/my-groups");
      console.log("grupos:", JSON.stringify(res.data));
      setGrupos(res.data);
    } catch (_error) {
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirGrupo = (grupo: any) => {
    groupContext.set(grupo.id, grupo.name, grupo.adminId);
    router.push("/grupo");
  };

  const abrirDrawer = () => {
    setDrawerAberto(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const fecharDrawer = () => {
    Animated.timing(translateX, {
      toValue: -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDrawerAberto(false));
  };

  const handleLogout = () => {
    fecharDrawer();
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair", style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/login");
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1E4D" }}>

      {/* Overlay escuro quando drawer aberto */}
      {drawerAberto && (
        <TouchableWithoutFeedback onPress={fecharDrawer}>
          <View style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10
          }} />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer lateral */}
      <Animated.View style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: DRAWER_WIDTH, backgroundColor: "#1D2F6F",
        zIndex: 20, transform: [{ translateX }],
        paddingTop: 60, paddingHorizontal: 20
      }}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 40 }}>
          Menu
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ paddingVertical: 15, marginTop: 10 }}
        >
          <Text style={{ color: "#E74C3C", fontSize: 16, fontWeight: "bold" }}>🚪 Sair da Conta</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

        {/* Header com ≡ */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 50, marginBottom: 30 }}>
  <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
    Meus Grupos 📚
  </Text>
  <TouchableOpacity onPress={abrirDrawer}>
    <Text style={{ color: "white", fontSize: 26 }}>☰</Text>
  </TouchableOpacity>
</View>

        {loading ? (
          <ActivityIndicator color="#4F7CFF" size="large" />
        ) : grupos.length > 0 ? (
          grupos.map((grupo: any) => (
            <TouchableOpacity
              key={grupo.id}
              onPress={() => abrirGrupo(grupo)}
              style={{ backgroundColor: "#1D2F6F", padding: 20, borderRadius: 15, marginBottom: 15 }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{grupo.name}</Text>
              <Text style={{ color: "#ccc", marginTop: 5 }}>{grupo.memberCount ?? "?"} membros</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: "#ccc", textAlign: "center", marginBottom: 20 }}>
            Você ainda não participa de nenhum grupo.
          </Text>
        )}

        <TouchableOpacity
          onPress={() => router.push("/novoGrupo")}
          style={{ backgroundColor: "#4F7CFF", padding: 20, borderRadius: 15, marginBottom: 15 }}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>+ Criar Grupo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/entrarGrupo")}
          style={{ borderWidth: 1, borderColor: "#4F7CFF", borderStyle: "dashed", padding: 20, borderRadius: 15 }}
        >
          <Text style={{ color: "#4F7CFF", textAlign: "center", fontWeight: "bold" }}>+ Entrar em Grupo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}