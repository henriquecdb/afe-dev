import { serverIP } from "@/app/globalInfo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ExpensesChart from "./chartComponent";
import * as handle from "./handles";
import { styles } from "./style/homeStyle";

export default function HomeScreen() {
  const [expenses, setExpenses] = useState([]);
  const [isLoadingUserExp, setIsLoadingUserExp] = useState(true);
  const [entries, setEntries] = useState([]);
  const [isLoadingUserEnt, setIsLoadingUserEnt] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "Carregando...",
    objective: 0,
  });

  useEffect(() => {
    async function loadUserData() {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          console.log("ID do usuário não encontrado");
          handle.handleRoute("/");
          return;
        }

        const response = await fetch(`http://${serverIP}/user/${userId}`);

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do usuário");
        }

        const data = await response.json();
        setUserData({
          name: data.name || "Usuário",
          objective: data.objective || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  useEffect(() => {
    async function loadUserTotalExp() {
      setIsLoadingUserExp(true);
      try {
        const loggedUserId = await AsyncStorage.getItem("userId");

        if (!loggedUserId) {
          Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
          handle.handleRoute("/");
          return;
        }

        const today = new Date;
        const response = await fetch(
          `http://${serverIP}/userExpensesTotal/${loggedUserId}/${(today.getMonth() + 1)}`
        );
        const dados = await response.json();

        if (response.ok) {
          setExpenses(dados);
        } else {
          setExpenses([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário" + error);
      } finally {
        setIsLoadingUserExp(false);
      }
    }

    if (isLoadingUserExp) {
      loadUserTotalExp();
    }
  });

  useEffect(() => {
    async function loadUserTotalEnt() {
      setIsLoadingUserEnt(true);
      try {
        const loggedUserId = await AsyncStorage.getItem("userId");

        if (!loggedUserId) {
          Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
          handle.handleRoute("/");
          return;
        }

        const today = new Date;
        const response = await fetch(
          `http://${serverIP}/userEntriesTotal/${loggedUserId}/${(today.getMonth() + 1)}`
        );
        const dados = await response.json();

        if (response.ok) {
          setEntries(dados);
        } else {
          setEntries([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário" + error);
      } finally {
        setIsLoadingUserEnt(false);
      }
    }

    if (isLoadingUserEnt) {
      loadUserTotalEnt();
    }
  });

  if (loading && isLoadingUserExp) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#FFD580" />
      </View>
    );
  }

  const checkBalance = (value) => {
    if (value < 0) {
      return "#E74C3C";
    } else {
      return "#45973B";
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => handle.handleRoute("/profile")}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {handle.getInitials(userData.name)}
              </Text>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.cardRow}>
          <Pressable
            style={styles.card}
            onPress={() => handle.handleRoute("/entries")}
          >
            <View>
              <Text style={styles.cardTitle}>Entradas</Text>
              <Text style={[styles.cardValue, styles.incomeValue]}>
                {handle.formatCurrency(entries.totalEnt)}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => handle.handleRoute("/expenses")}
          >
            <View>
              <Text style={styles.cardTitle}>Saídas</Text>
              <Text style={[styles.cardValue, styles.expenseValue]}>
                {handle.formatCurrency(expenses.totalExp)}
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.cardRow}>
          <Pressable
            style={styles.card}
            onPress={() => handle.handleRoute("/balance")}
          >
            <View>
              <Text style={styles.cardTitle}>Saldo</Text>
              <Text style={[styles.cardValue, { color: `${checkBalance(entries.totalEnt - expenses.totalExp)}` }]}>
                {handle.formatCurrency(entries.totalEnt - expenses.totalExp)}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => handle.handleRoute("/profile")}
          >
            <View>
              <Text style={styles.cardTitle}>Objetivo</Text>
              <Text style={[styles.cardValue, styles.goalValue]}>
                {handle.formatCurrency(userData.objective)}
              </Text>
            </View>
          </Pressable>
        </View>

        <ExpensesChart></ExpensesChart>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => handle.handleRoute("/add-expense")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}