export const onceLog = (message: string, m1: any) => {
    let count = 0;
    const maxCount = 50;
    return () => {
        if (count < maxCount) {
            console.log(message, m1);
            count++;
        }
    };
};
