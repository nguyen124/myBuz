var items = [
    {
        title: "Hello 3",
        titleUrl: "../../assets/image/img3.JPG",
        url: "../../assets/image/img3.JPG",
        thumbnail: "../../assets/image/img3.JPG",
        modifiedDate: "1546185702286",
        createdBy: {
            userId: "5c28486b1777ef460f90a774",
            name: "Hai dap chai",
            avatar: "../../assets/image/avatar1.jpg",
            rank: "pro",
            followers: 1000
        },
        tags: ["tag1", "tag2", "tag3", "tag4"],
        categories: ["Funny", "Wtf"],
        point: 1000,
        seen: 1500,
        share: 200,
        comment: 1000,
        status: "active",
        isAdult: false,
        isSafeAtWork: true,
        isSensitive: false,
        creditBy: ["linkToCredit.com"],
        isAutoPlayed: true,
        hasSound: false,
        length: 60
    },
];

var itemUserLogs = [
    {
        userId: "5c28486b1777ef460f90a774",
        itemId: "5c28486b1777ef460f90a774",
        action: [{ "upVote": 123123 }, { "seen": 123123 }, { "share": 123123 }, { "report": 123123 }]
    },
    {
        userId: "5c28486b1777ef460f90a774",
        itemId: "5c28486b1777ef460f90a774",
        action: [{ "create": 123123 }, { "seen": !23123 }]
    },
    {
        userId: "5c28486b1777ef460f90a774",
        itemId: "5c28486b1777ef460f90a774",
        action: [{ "downVote": 123123 }, { "report": 123123 }]
    },
    {
        userId: "5c28486b1777ef460f90a774",
        itemId: "5c28486b1777ef460f90a774",
        action: [{ "glanced": 123123 }]
    }
];

var commentUserLogs = [
    {
        userId: "5c28486b1777ef460f90a774",
        commentId: "5c28486b1777ef460f90a774",
        action: [
            { upVote: 123123 }, { share: 123123 }, { report: 123123 }
        ]
    },
    {
        userId: "5c28486b1777ef460f90a774",
        commentId: "5c28486b1777ef460f90a774",
        action: [{ downVote: 123123 }, { report: 123123 }]
    },
    {
        userId: "5c28486b1777ef460f90a774",
        commentId: "5c28486b1777ef460f90a774",
        action: [{
            reply: 123123,
            replyContent: "hahhaahahaha"
        }]
    }
];

var userUserLogs = [
    {
        firstUserId: "5c28486b1777ef460f90a774",
        secondUserId: "5c28486b1777ef460f90a774",
        action: [{ "follow": 123123 }]
    },
    {
        firstUserId: "5c28486b1777ef460f90a774",
        secondUserId: "5c28486b1777ef460f90a774",
        action: [{ "unfollow": 123123 }]
    }
];

var users = [
    {
        email: "thanh@gmail.com",
        avatar: "../../assets/image/avatar1.jpg",
        userName: "kimthanh",
        password: "c26795be955e46a30cd11ef4432e462d68a613b1",
        joinedDate: "12/12/2012",
        rank: "pro",
        status: "active"
    },
    {
        email: "nguyen@gmail.com",
        avatar: "../../assets/image/avatar1.jpg",
        userName: "haidapchai",
        password: "c26795be955e46a30cd11ef4432e462d68a613b1",
        joinedDate: "12/12/2012",
        rank: "pro",
        status: "active"
    }
];

var comments = [
    {
        content: "hahah too funny ",
        url: "../../assets/gif/giphy3.gif",
        modifiedDate: 234234243,
        writtenBy: {
            userId: "5c28486b1777ef460f90a774",
            name: "Hai dap chai",
            avatar: "../../assets/image/avatar1.jpg"
        },
        itemId: "5c2719491777ef460f90a767",
        replyTo: "5c2719491777ef460f90a767",
        point: 1000,
        replies: 1000
    }
];
