module.exports = {
    // used to convert a phone number from a human format to a number for our SMS Texting API
    convertPhoneNumber: (phoneNumber) => {
        return `+1${phoneNumber.replace(/-/gi,'')}`;
    }
}