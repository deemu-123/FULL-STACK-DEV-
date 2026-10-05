const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

const dbName = "studentDB";
const collectionName = "students";

async function main() {

    try {

        // 1. Connect to MongoDB
        await client.connect();

        console.log("Connected to MongoDB!");

        // 2. Select database
        const db = client.db(dbName);

        // 3. Select collection
        const collection = db.collection(collectionName);

        // 4. Student data
        const students = [
            {
                studentId: 101,
                name: "Anita",
                department: "CSE",
                subjects: [
                    { subject: "DBMS", marks: 85, grade: "A" },
                    { subject: "AI", marks: 90, grade: "A+" },
                    { subject: "Web Development", marks: 78, grade: "B+" }
                ]
            },

            {
                studentId: 102,
                name: "Rahul",
                department: "CSE",
                subjects: [
                    { subject: "DBMS", marks: 75, grade: "B+" },
                    { subject: "AI", marks: 82, grade: "A" },
                    { subject: "Web Development", marks: 88, grade: "A" }
                ]
            },

            {
                studentId: 103,
                name: "Priya",
                department: "AIML",
                subjects: [
                    { subject: "DBMS", marks: 92, grade: "A+" },
                    { subject: "AI", marks: 95, grade: "A+" },
                    { subject: "Web Development", marks: 89, grade: "A" }
                ]
            },

            {
                studentId: 104,
                name: "Kiran",
                department: "AIML",
                subjects: [
                    { subject: "DBMS", marks: 68, grade: "B" },
                    { subject: "AI", marks: 74, grade: "B+" },
                    { subject: "Web Development", marks: 80, grade: "A" }
                ]
            }
        ];

        // 5. Remove old data
        await collection.deleteMany({});

        // 6. Insert student data
        await collection.insertMany(students);

        console.log("Student records inserted successfully!");

        // 7. Aggregation
        const result = await collection.aggregate([

            // Break subjects array into separate documents
            {
                $unwind: "$subjects"
            },

            // Calculate statistics for each student
            {
                $group: {
                    _id: "$studentId",

                    name: {
                        $first: "$name"
                    },

                    department: {
                        $first: "$department"
                    },

                    totalMarks: {
                        $sum: "$subjects.marks"
                    },

                    averageMarks: {
                        $avg: "$subjects.marks"
                    },

                    highestMarks: {
                        $max: "$subjects.marks"
                    },

                    lowestMarks: {
                        $min: "$subjects.marks"
                    }
                }
            },

            // Select the fields we want to display
            {
                $project: {
                    _id: 0,
                    studentId: "$_id",
                    name: 1,
                    department: 1,
                    totalMarks: 1,

                    averageMarks: {
                        $round: ["$averageMarks", 2]
                    },

                    highestMarks: 1,
                    lowestMarks: 1
                }
            },

            // Highest average first
            {
                $sort: {
                    averageMarks: -1
                }
            }

        ]).toArray();

        // 8. Display result
        console.log("\nSTUDENT GRADE SUMMARY");
        console.table(result);

    } catch (error) {

        console.error("MongoDB Error:");
        console.error(error);

    } finally {

        // 9. Close connection
        await client.close();
    }
}

main();
