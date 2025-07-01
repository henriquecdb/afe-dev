import { serverIP } from "@/components/globalInfo";
import { Feather } from "@expo/vector-icons";
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

export default function RegisterView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    senha: false,
    senha2: false,
    nome: false,
  });

  const validateInputs = () => {
    const newErrors = {
      email: email.trim() === "" || !email.includes("@"),
      senha: senha.length < 6,
      senha2: senha !== senha2,
      nome: nome.trim() === "",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://${serverIP}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: senha,
          name: nome,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              router.replace("/");
            }, 100);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", error.message);
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
        <View style={styles.content}>
          <Text style={styles.title}>Criar conta</Text>

          <View
            style={[styles.inputContainer, errors.nome && styles.inputError]}
          >
            <Feather name="user" size={20} color="#222" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              placeholderTextColor="#aaa"
            />
          </View>
          {errors.nome && (
            <Text style={styles.errorText}>Nome é obrigatório</Text>
          )}

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
          {errors.email && <Text style={styles.errorText}>Email inválido</Text>}

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
            <Text style={styles.errorText}>
              A senha deve ter pelo menos 6 caracteres
            </Text>
          )}

          <View
            style={[styles.inputContainer, errors.senha2 && styles.inputError]}
          >
            <Feather name="lock" size={20} color="#222" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              value={senha2}
              onChangeText={setSenha2}
              secureTextEntry
              placeholderTextColor="#aaa"
            />
          </View>
          {errors.senha2 && (
            <Text style={styles.errorText}>As senhas não coincidem</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>CADASTRAR</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já possui uma conta? </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.footerLink}>Login</Text>
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 24,
    zIndex: 2,
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 32,
    alignItems: "stretch",
    position: "relative",
    justifyContent: "space-between",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
    marginTop: 8,
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
