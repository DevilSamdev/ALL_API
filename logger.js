const {createLogger,transports,format}=require('winston')

const apiLogger=createLogger({
    transports:[
                new transports.File({
                level:'info',
                filename:'filelog-info.log',
                text:true,
                format:format.combine(
                format.timestamp(),
                format.json()
            )
        }),


                new transports.File({
                level:'error',
                filename:'filelog-error.log',
                text:true,
                format:format.combine(
                format.timestamp(),
                format.json()
            )
        }),
    ],
})

module.exports=apiLogger