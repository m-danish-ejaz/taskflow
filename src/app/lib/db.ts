const DB_KEY = "taskflow-db";

export const getDB = () => {
    const db = localStorage.getItem(DB_KEY);

    if (!db) {
        const initial = {
            users: [],
            tasks: [],
            submissions: [],
            campaigns: [],
        };

        localStorage.setItem(DB_KEY, JSON.stringify(initial));
        return initial;
    }

    return JSON.parse(db);
};

export const saveDB = (data: any) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
};