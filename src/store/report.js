export default {
	state: {
		reportsData: JSON.parse(localStorage.getItem("reports") || "[]"),
	},
	mutations: {
		EDIT_REPORT(state, payload) {
			const res = state.reportsData.map((el) => {
				if (el.mId === payload.mId) return payload;
				return el;
			});
			state.reportsData = res;
			localStorage.setItem("reports", JSON.stringify(state.reportsData));
		},
		REMOVE_REPORT(state, payload) {
			const res = state.reportsData.filter((el) => el.mId !== payload.mId);
			state.reportsData = res;
			localStorage.setItem("reports", JSON.stringify(state.reportsData));
		},
		SET_REPORTS_DATA(state, payload) {
			state.reportsData.push(payload);
			localStorage.setItem("reports", JSON.stringify(state.reportsData));
		},
		CHANGE_STATUS_REPORT(state, payload) {
			if (payload && payload.status) payload.status = "done";
			const res = state.reportsData.map((el) => {
				if (payload.mId === el.mId) return payload;
				return el;
			});
			state.reportsData = res;
			localStorage.setItem("reports", JSON.stringify(state.reportsData));
		},
	},
	actions: {
		editReport({ commit }, report) {
			commit("EDIT_REPORT", report);
		},
		removeReport({ commit }, report) {
			commit("REMOVE_REPORT", report);
		},
		setReportData({ commit }, report) {
			commit("SET_REPORTS_DATA", report);
		},
		changeStatusReport({ commit }, item) {
			commit("CHANGE_STATUS_REPORT", item);
		},
	},
	getters: {},
};
