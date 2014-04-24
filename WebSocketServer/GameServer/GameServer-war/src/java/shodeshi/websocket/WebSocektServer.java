/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package shodeshi.websocket;

import java.io.IOException;
import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import shodeshi.control.ChessControl;
import shodeshi.model.Chess;
import shodeshi.model.Match;
import shodeshi.model.User;

/**
 *
 * @author tyang
 */
@ServerEndpoint("/server")
public class WebSocektServer {

    private User user;

    @OnMessage
    public void onMessage(String message, Session session)
            throws IOException, InterruptedException {
        JsonObjectBuilder responseBuilder = Json.createObjectBuilder();

        JsonReader jsonreader = Json.createReader(new StringReader(message));
        JsonObject request = jsonreader.readObject();
        jsonreader.close();

        String action = request.getString("action");
        ChessControl control = ChessControl.getInstance();
        switch (action) {
            case "go":
                Chess chess = new Chess(request.getInt("positionX"), request.getInt("positionY"));
                control.getMatch().getChessList().add(chess);
                sendToAll(session, message);
                break;
            case "reset":
                if (control.getMatch().getPlayingUsers().size() == 2) {
                    control.getMatch().resetMatch();
                }
                if (user != null) {
                    control.getMatch().addPlayingUser(user);
                } else {
                    System.out.println("No user error");
                }

                String response = responseBuilder.add("action", "assignOrder").add("playerOrder", control.getMatch().getPlayingUsers().size()).build().toString();
                sendToOne(session, response);

                responseBuilder = Json.createObjectBuilder();
                response = responseBuilder.add("action", "reset").add("match", control.getMatch().buildJsonObject()).build().toString();
                sendToAll(session, response);
                break;
            case "login":
                user = new User();
                user.setSession(session);
                user.setUserName(request.getString("userName"));
                control.getMatch().addOnlineUser(user);
                sendToAll(session, responseBuilder.add("action", "newPlayer").add("match", control.getMatch().buildJsonObject()).build().toString());
                break;
        }
    }

    @OnOpen
    public void onOpen(Session session) throws IOException, InterruptedException {
        JsonObjectBuilder responseBuilder = Json.createObjectBuilder();
        sendToOne(session, responseBuilder.add("action", "init").add("match", ChessControl.getInstance().getMatch().buildJsonObject()).build().toString());
        System.out.println("on open" + this.toString());
    }

    @OnClose
    public void onClose() {
        Match match = ChessControl.getInstance().getMatch();
        match.getOnlineUsers().remove(user);
        match.getPlayingUsers().remove(user);

        if (match.getPlayingUsers().size() < 2) {
            System.out.println("Not enough players, reset game.");
            match.resetMatch();
        }

        JsonObjectBuilder responseBuilder = Json.createObjectBuilder();
        responseBuilder.add("action", "playerExit");
        responseBuilder.add("match", match.buildJsonObject());
        try {
            sendToAll(user.getSession(), responseBuilder.build().toString());
        } catch (IOException ex) {
            Logger.getLogger(WebSocektServer.class.getName()).log(Level.SEVERE, null, ex);
        }
        System.out.println(user.getUserName() + " exit");
    }

    @OnError
    public void onError(Throwable t) {
        t.printStackTrace();
    }

    private void sendToOne(Session session, String message) throws IOException {
        session.getBasicRemote().sendText(message);
    }

    private void sendToAll(Session session, String message) throws IOException {
        for (Session s : session.getOpenSessions()) {
            s.getBasicRemote().sendText(message);
        }
    }
}
