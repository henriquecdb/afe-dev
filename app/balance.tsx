import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const months = [
    { label: "Janeiro", value: 1 },
    { label: "Fevereiro", value: 2 },
    { label: "Março", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Maio", value: 5 },
    { label: "Junho", value: 6 },
    { label: "Julho", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Setembro", value: 9 },
    { label: "Outubro", value: 10 },
    { label: "Novembro", value: 11 },
    { label: "Dezembro", value: 12 },
];

export default function ExpenseScreen() {
    const router = useRouter();
    const [expenses, setExpenses] = useState([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [userData, setUserData] = useState({
        id: null,
        value: 0,
        category: 0,
        data: "",
    });

    useEffect(() => {
        async function loadUserData() {
            setIsLoadingUser(true);
            try {
                const loggedUserId = await AsyncStorage.getItem("userId");

                if (!loggedUserId) {
                    Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
                    router.push("/");
                    return;
                }

                const response = await fetch(
                    `http://192.168.1.118:3001/userBalance/${loggedUserId}/${month}`
                );
                const dados = await response.json();

                if (response.ok) {
                    setExpenses(dados);
                } else {
                    Alert.alert("Erro", "Não foi possível carregar as despesas para o mês");
                    setExpenses([]);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                //Alert.alert("Erro", "Não foi possível carregar os dados do usuário" + error);
            } finally {
                setIsLoadingUser(false);
            }
        }

        if (isLoadingUser) {
            loadUserData();
        }
    });

    const today = new Date;
    const [month, setMonth] = useState(today.getMonth() + 1);

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === month && (
                    <Feather name="check-circle" size={20} color="black" />
                )}
            </View>
        );
    };

    const checkBalance = (value) => {
    if (value < 0) {
      return "#E74C3C";
    } else {
      return "#45973B";
    }
  }
    const essencialsColor = {
        entry: {
            backgroundColor: "#22AADE",
        },
    };

    const foodColor = {
        entry: {
            backgroundColor: "#3377B7",
        },
    };

    const leisureColor = {
        entry: {
            backgroundColor: "#76B947",
        },
    };

    const formatData = (data: string) => {
        return data.slice(0, 10);
    };

    const formatValue = (value: string) => {
        value = value.toString();
        if (value.includes(".")) {
            return value.replace(".", ",");
        } else {
            return value.concat(",00");
        }

    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value || 0);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saldo</Text>
                <View style={styles.headerSpacer} />
            </View>

            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={months}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Selecione o mês"
                value={month}
                onChange={(item) => {
                    setIsLoadingUser(true);
                    setMonth(item.value);
                }}
                renderRightIcon={() => (
                    <Ionicons name="caret-down-outline" size={20} color="black" />
                )}
                renderItem={renderItem}
            />

            <SafeAreaProvider>
                <SafeAreaView style={styles.entryContainer}>
                    <ScrollView>
                        {expenses.map((expData, i) =>
                            <View style={[styles.entry, { backgroundColor: `${checkBalance(expData.value)}` }]} key={i}>
                                <Ionicons name="fitness-outline" size={36} color={"black"} />
                                <View style={styles.entryTextContainer}>
                                    <Text style={styles.entryTitle}>{expData.name}</Text>
                                    <Text style={styles.entryDateTime}>{formatData(expData.data)}</Text>
                                </View>
                                <View style={styles.entryCost}>
                                    <Text style={styles.costText}>- {formatCurrency(expData.value)}</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
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
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#333",
    },

    dropdown: {
        height: 50,
        width: 140,
        alignSelf: "center",
        borderWidth: 2,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
    },
    placeholderStyle: {
        flex: 1,
        fontSize: 16,
        color: "#999",
    },
    selectedTextStyle: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        textAlign: "center"
    },
    item: {
        padding: 17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    icon: {
        marginRight: 6,
    },
    entryContainer: {
        marginTop: 50,
        flex: 1,
    },
    entry: {
        height: 70,
        flexDirection: "row",
        padding: 12,
        margin: 10,
        backgroundColor: "rgba(226, 255, 223, 1)",
        borderRadius: 10,
        alignItems: "center",
    },
    entryTextContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 8,
    },
    entryTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    entryDateTime: {
        fontSize: 14,
        color: "black",
        marginTop: 4,
    },
    entryCost: {
        height: 50,
        width: 100,
        alignItems: "flex-start",
        paddingTop: 15,
        paddingBottom: 15,
    },
    costText: {
        fontSize: 16,
    },
});
