import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const chartData = [
  {
    name: "Essenciais",
    value: 40,
    color: "#22AADE",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Alimentação",
    value: 30,
    color: "#3377B7",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Imprevistos",
    value: 10,
    color: "#FF9924",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Besteiras",
    value: 7,
    color: "#8F8F8F",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
  {
    name: "Lazer",
    value: 13,
    color: "#76B947",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "Carregando...",
    objective: 0,
  });
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  useEffect(() => {
    async function loadUserData() {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          console.log("ID do usuário não encontrado");
          router.replace("/");
          return;
        }

        const response = await fetch(`http://localhost:3001/user/${userId}`);

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

  if (loading) {
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {getInitials(userData.name)}
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
            onPress={() => router.push("/entries")}
          >
            <View>
              <Text style={styles.cardTitle}>Entradas</Text>
              <Text style={[styles.cardValue, styles.incomeValue]}>
                R$ 1070,00
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/expenses")}
          >
            <View>
              <Text style={styles.cardTitle}>Saídas</Text>
              <Text style={[styles.cardValue, styles.expenseValue]}>
                R$ 424,30
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.cardRow}>
          <Pressable
            style={styles.card}
            onPress={() => router.push("/balance")}
          >
            <View>
              <Text style={styles.cardTitle}>Saldo</Text>
              <Text style={[styles.cardValue, styles.balanceValue]}>
                R$ 645,70
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/profile")}
          >
            <View>
              <Text style={styles.cardTitle}>Objetivo</Text>
              <Text style={[styles.cardValue, styles.goalValue]}>
                {formatCurrency(userData.objective)}
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.expenseSection}>
          <Text style={styles.sectionTitle}>Gastos</Text>

          <View style={styles.chartWithLegend}>
            <View style={styles.chartOnly}>
              <PieChart
                data={chartData}
                width={150}
                height={150}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="0"
                center={[50, 0]}
                absolute={false}
                hasLegend={false}
              />
            </View>

            <View style={styles.legendOnly}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push("/add-expense")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  scroll: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginTop: 10,
    marginHorizontal: 40,
  },
  progressFill: {
    width: "100%",
    height: 6,
    backgroundColor: "#FFD580",
    borderRadius: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  incomeValue: {
    color: "#45973B",
  },
  expenseValue: {
    color: "#E74C3C",
  },
  balanceValue: {
    color: "#45973B",
  },
  goalValue: {
    color: "#3377B7",
  },
  expenseSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  chartWithLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartOnly: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  legendOnly: {
    width: "55%",
    paddingLeft: 40,
  },
  chartContainer: {
    alignItems: "center",
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: "#777",
  },
  bottomSpacing: {
    height: 80,
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFD580",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 30,
  },
});
