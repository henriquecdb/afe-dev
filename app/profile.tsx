import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("exemplo@email.com");
  const [password, setPassword] = useState("••••••••••");
  const [objective, setObjective] = useState("500,00 R$");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainerLarge}>
            <Text style={styles.avatarTextLarge}>JE</Text>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Feather name="edit-2" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>José Eduardo</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              secureTextEntry={true}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Objetivo</Text>
          <View style={styles.objectiveContainer}>
            <TextInput
              style={styles.objectiveInput}
              value={objective}
              onChangeText={setObjective}
              keyboardType="numeric"
              placeholder="Defina seu objective financeiro"
              placeholderTextColor="#aaa"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainerLarge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E6F0F9",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarTextLarge: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#666",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 12,
  },
  infoSection: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    padding: 5,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 8,
  },
  objectiveContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  objectiveInput: {
    fontSize: 16,
    color: "#666",
  },
});
