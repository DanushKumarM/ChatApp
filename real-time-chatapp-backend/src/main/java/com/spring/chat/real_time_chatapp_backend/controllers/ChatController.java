package com.spring.chat.real_time_chatapp_backend.controllers;

import com.spring.chat.real_time_chatapp_backend.entities.Message;
import com.spring.chat.real_time_chatapp_backend.entities.Room;
import com.spring.chat.real_time_chatapp_backend.payload.MessageRequest;
import com.spring.chat.real_time_chatapp_backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

    @Autowired
    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // for sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}") // /chat/sendMessage/roomId
    @SendTo("/topic/room/{roomId}") // subscribe
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest request) {
        Room room = roomRepository.findByRoomId(request.getRoomId());
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if(room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        }else  {
            throw  new RuntimeException("Room Not Found");
        }

        return  message;
    }
}
