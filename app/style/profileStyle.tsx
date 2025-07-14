import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
  inputDisabled: {
    color: "#999",
    backgroundColor: "#f5f5f5",
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  objectiveInput: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  editObjectiveButton: {
    padding: 5,
  },
  saveButton: {
    backgroundColor: "#FFD580",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#B0C4DE",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});