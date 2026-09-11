import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useState, useEffect, useRef } from "react";
import { TimerContext } from "../services/timerContext";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [sessaoAtiva, setSessaoAtiva] = useState(false);
  const intervaloRef = useRef<any>(null);

  useEffect(() => {
    if (rodando) {
      intervaloRef.current = setInterval(() => {
        setTempo(t => t + 1);
      }, 1000);
    } else {
      clearInterval(intervaloRef.current);
    }
    return () => clearInterval(intervaloRef.current);
  }, [rodando]);

  return (
    <TimerContext.Provider value={{ tempo, rodando, sessaoAtiva, setTempo, setRodando, setSessaoAtiva }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ headerShown: false }} />
        <Stack.Screen name="recuperarSenha" options={{ headerShown: false }} />
        <Stack.Screen name="grupos" options={{ headerShown: false }} />
        <Stack.Screen name="grupo" options={{ headerShown: false }} />
        <Stack.Screen name="novoGrupo" options={{ headerShown: false }} />
        <Stack.Screen name="entrarGrupo" options={{ headerShown: false }} />
        <Stack.Screen name="editarGrupo" options={{ headerShown: false }} />
        <Stack.Screen name="excluirGrupo" options={{ headerShown: false }} />
        <Stack.Screen name="sairGrupo" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="agenda" options={{ headerShown: false }} />
        <Stack.Screen name="lembretes" options={{ headerShown: false }} />
        <Stack.Screen name="novoLembrete" options={{ headerShown: false }} />
        <Stack.Screen name="resumos" options={{ headerShown: false }} />
        <Stack.Screen name="novoResumo" options={{ headerShown: false }} />
        <Stack.Screen name="resumoDetalhe" options={{ headerShown: false }} />
        <Stack.Screen name="comentarios" options={{ headerShown: false }} />
        <Stack.Screen name="membros" options={{ headerShown: false }} />
        <Stack.Screen name="solicitacoes" options={{ headerShown: false }} />
        <Stack.Screen name="removerMembro" options={{ headerShown: false }} />
        <Stack.Screen name="transferirAdm" options={{ headerShown: false }} />
        <Stack.Screen name="denunciarUsuario" options={{ headerShown: false }} />
        <Stack.Screen name="rankingDiario" options={{ headerShown: false }} />
        <Stack.Screen name="rankingMensal" options={{ headerShown: false }} />
        <Stack.Screen name="chamada" options={{ headerShown: false }} />
        <Stack.Screen name="perfil" options={{ headerShown: false }} />
        <Stack.Screen name="editarPerfil" options={{ headerShown: false }} />
        <Stack.Screen name="excluirConta" options={{ headerShown: false }} />
        <Stack.Screen name="notificacoes" options={{ headerShown: false }} />
        <Stack.Screen name="modoFoco" options={{ headerShown: false }} />
        <Stack.Screen name="painelUsuarios" options={{ headerShown: false }} />
        <Stack.Screen name="painelGrupos" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </TimerContext.Provider>
  );
}
