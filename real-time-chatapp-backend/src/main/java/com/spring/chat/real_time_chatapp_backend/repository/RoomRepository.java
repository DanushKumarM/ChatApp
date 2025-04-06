package com.spring.chat.real_time_chatapp_backend.repository;

import com.spring.chat.real_time_chatapp_backend.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository  extends MongoRepository<Room, String> {

    //get Room using room id

    Room findByRoomId(String roomId);
}
