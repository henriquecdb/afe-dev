import { useRouter } from "expo-router";
import * as global from "./globalInfo";

export const router = useRouter();

export function handleRoute(route) {
    return router.replace(route);
}

export const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value || 0);
};

const isToday = (date: Date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const formatDate = (date: Date) => {
    if (isToday(date)) {
        return "Agora, Hoje";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const getInitials = (name) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};

export const pickIcon = (category) => {
    return global.categories.at(category)?.icon;
}

export const pickColor = (category) => {
    return global.categories.at(category)?.color;
}