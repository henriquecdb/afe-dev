import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";

import { serverIP } from "@/app/globalInfo";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import * as handle from "./handles";
import { styles } from "./style/indexStyle";

export default function LoginView() {
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
      await AsyncStorage.setItem("userId", data.user.id.toString());
      handle.handleRoute("/home");
    } else if (response.status === 401) {
      setLoginError(
        "Email ou senha incorretos. Por favor, verifique suas credenciais."
      );
    } else {
      Alert.alert("Erro", data.error || "Ocorreu um erro durante o login");
    }
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

          <Pressable onPress={() => handle.handleRoute("/recover")}>
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
          <Pressable onPress={() => handle.handleRoute("/register")}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}