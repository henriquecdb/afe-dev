import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const handleLogin = () => {
    // Lógica de autenticação aqui
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Por favor, entre para continuar</Text>

          <View style={styles.inputContainer}>
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

          <View style={styles.inputContainer}>
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

          <Pressable onPress={() => router.push("/recover")}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </Pressable>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
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
    marginBottom: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 48,
    width: "100%",
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
    marginTop: -8,
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
