/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.shodeshi.websocket;

import java.io.IOException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author tyang
 */
@ServerEndpoint("/chat")
public class WebSocektServer {
    
@OnMessage
public void onMessage(String message, Session session)
    throws IOException, InterruptedException {
    
    System.out.println("hahahahaa!!!!");

    for(Session s: session.getOpenSessions()){
        if(s.isOpen())
            s.getBasicRemote().sendText(message);
    }
}
    
@OnOpen
public void onOpen(){
    System.out.println("on open");
}

@OnClose
public void onClose(){
    System.out.println("closed");
}
    @OnError
    public void onError(Throwable t) {
        t.printStackTrace();
    }
}
