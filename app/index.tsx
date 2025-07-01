import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import { serverIP } from "@/components/globalInfo";
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

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    senha: false,
  });
  const [loginError, setLoginError] = useState("");

  const validateInputs = () => {
    const newErrors = {
      email: email.trim() === "",
      senha: senha.trim() === "",
    };

    setErrors(newErrors);
    setLoginError("");

    return !Object.values(newErrors).some((error) => error);
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setLoginError("");

    const response = await fetch(`http://${serverIP}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: senha,
      }),
    }).catch(() => {
      Alert.alert("Erro", "Falha na conexão com o servidor");
      setIsLoading(false);
      return null;
    });

    if (!response) return;

    const data = await response.json().catch(() => ({}));
    setIsLoading(false);

    if (response.ok) {
      // Salvar o ID do usuário no AsyncStorage
      await AsyncStorage.setItem("userId", data.user.id.toString());
      router.replace("/home");
    } else if (response.status === 401) {
      setLoginError(
        "Email ou senha incorretos. Por favor, verifique suas credenciais."
      );
    } else {
      Alert.alert("Erro", data.error || "Ocorreu um erro durante o login");
    }
    // if (response.ok) {
    //   router.replace("/home");
    // } else if (response.status === 401) {
    //   setLoginError(
    //     "Email ou senha incorretos. Por favor, verifique suas credenciais."
    //   );
    // } else {
    //   Alert.alert("Erro", data.error || "Ocorreu um erro durante o login");
    // }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Por favor, entre para continuar</Text>

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
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholderTextColor="#aaa"
            />
          </View>
          {errors.senha && (
            <Text style={styles.errorText}>Senha é obrigatória</Text>
          )}

          {loginError ? (
            <Text style={styles.errorText}>{loginError}</Text>
          ) : null}

          <Pressable onPress={() => router.push("/recover")}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </Pressable>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não possui uma conta? </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </Pressable>
        </View>
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
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 32,
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 28,
    fontWeight: "600",
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
  forgotText: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FFD580",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 4,
    width: "70%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 16,
    paddingBottom: 40,
  },
  footerText: {
    color: "#aaa",
    fontSize: 15,
  },
  footerLink: {
    color: "#FFD580",
    fontWeight: "bold",
    fontSize: 15,
  },
});
