const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

// This job will run at 8 AM in the morning everyday
cron.schedule("0 8 * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStartTime = startOfDay(yesterday);
        const yesterdayEndTime = endOfDay(yesterday);

        const pendingRequest = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStartTime,
                $lt: yesterdayEndTime
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [
            ...new Set(pendingRequest.map((req) => req.toUserId.email))
        ]

        for(const email of listOfEmails){
            // Send Emails
            try{
                const res = await sendEmail.run(
                    "New Friend Requests pending for " + email,
                    "There are few friend requests pending, please login to the Dev Tinder Application and approve or reject the pending requests."
                );
                console.log(res)
            } catch (err) {
                console.log(err.message)
            }
        }

    } catch (err) {
        console.log(err.message);
    }
});
