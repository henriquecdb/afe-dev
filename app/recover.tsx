import { Feather, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { serverIP } from "@/components/globalInfo";

export default function RecoverView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    senha: false,
    codigo: false,
  });

  const validateInputs = () => {
    const newErrors = {
      email: email.trim() === "",
      senha: senha.trim() === "",
      codigo: codigo.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleRecover = async () => {
    if (!codigo.trim()) {
      const newErrors = {
        email: email.trim() === "",
        senha: senha.trim() === "",
        codigo: false,
      };

      setErrors(newErrors);

      if (newErrors.email || newErrors.senha) {
        return;
      }
    } else {
      if (!validateInputs()) {
        return;
      }
    }

    setIsLoading(true);

    try {
      if (!codigo.trim()) {
        const codeResponse = await fetch(
          `http://${serverIP}/request-password-reset`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const codeData = await codeResponse.json();

        if (codeResponse.ok) {
          Alert.alert(
            "Código Enviado",
            `Código: ${codeData.code}\n\nDigite o código no campo e clique novamente em ALTERAR SENHA.`
          );
          setIsLoading(false);
          return;
        } else if (codeResponse.status === 404) {
          Alert.alert("Erro", "Email não encontrado");
          setIsLoading(false);
          return;
        } else {
          Alert.alert("Erro", codeData.error || "Erro ao solicitar código");
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`http://${serverIP}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: codigo,
          newPassword: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Senha alterada com sucesso!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } else {
        Alert.alert("Erro", data.error || "Erro ao alterar senha");
      }
    } catch {
      Alert.alert("Erro", "Falha na conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#222" />
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Recupere sua senha</Text>
        <Text style={styles.subtitle}>
          Preencha email e nova senha. Se não tiver código, clique em ALTERAR
          SENHA para recebê-lo.
        </Text>

        <View
          style={[styles.inputContainer, errors.email && styles.inputError]}
        >
          <Feather name="mail" size={20} color="#222" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>
        {errors.email && (
          <Text style={styles.errorText}>Email é obrigatório</Text>
        )}

        <View
          style={[styles.inputContainer, errors.senha && styles.inputError]}
        >
          <Feather name="lock" size={20} color="#222" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>
        {errors.senha && (
          <Text style={styles.errorText}>Nova senha é obrigatória</Text>
        )}

        <View
          style={[styles.inputContainer, errors.codigo && styles.inputError]}
        >
          <Octicons name="code" size={20} color="#222" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor="#aaa"
          />
        </View>
        {errors.codigo && (
          <Text style={styles.errorText}>Código é obrigatório</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRecover}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>ALTERAR SENHA</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 24,
    zIndex: 2,
  },
  container: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 32,
    alignItems: "stretch",
    position: "relative",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 48,
    width: "100%",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  button: {
    backgroundColor: "#FFD580",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
    width: "70%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
