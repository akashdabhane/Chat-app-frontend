// export const baseUrl = 'http://localhost:9000/api/v1';
export const baseUrl = 'https://chatappbackend-kkuy.onrender.com/api/v1';

export const extractFirstName = (fullName) => {
    // Split the full name into an array of words
    const nameArray = fullName.split(' ');

    if (nameArray.length > 0) {
        // Get the first element of the array as the first name
        return nameArray[0];
    } else {
        return null;
    }
};