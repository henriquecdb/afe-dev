import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import * as global from "./globalInfo";
import { serverIP } from "./globalInfo";
import * as handle from "./handles";
import { styles } from "./style/homeStyle";

export default function ExpensesChart() {
    const [chartData, setChartData] = useState([]);
    /*const chartData = [
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
    ];*/

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        async function loadUserData() {
            setIsLoadingUser(true);
            try {
                const loggedUserId = await AsyncStorage.getItem("userId");

                if (!loggedUserId) {
                    Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
                    handle.handleRoute("/");
                    return;
                }
                const today = new Date;
                const response = await fetch(
                    `http://${serverIP}/expensesByCat/${loggedUserId}/${today.getMonth() + 1}`
                );
                const dados = await response.json();

                if (response.ok) {
                    setExpenses(dados);

                    const totalResponse = await fetch(
                        `http://${serverIP}/userTotalEntExpMonth/${loggedUserId}/${today.getMonth() + 1}`
                    );
                    const total = await totalResponse.json();
                    if (response.ok) {
                        setTotalExpenses(total);
                        console.log("Total de Saidas = " + total);
                    }

                    if (total > 0) {
                        const formattedData = expenses.map((item) => ({
                            name: global.categories[item.category].label,
                            value: (item.totalPorCat / total) * 100,
                            color: global.categories[item.category].color,
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 12,
                        }));

                        setChartData(formattedData);
                        console.log("Dados do grafico" + chartData);

                    }
                } else {
                    setExpenses([]);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário" + error);
            } finally {
                setIsLoadingUser(false);
            }
        }

        if (isLoadingUser) {
            loadUserData();
        }
    });


    return (
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
    )
}