/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package shodeshi.test;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author tyang
 */
public class Test {
    public static void main(String args[]){
//        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();
//        JsonObjectBuilder objBuilder = Json.createObjectBuilder();
//        objBuilder.add("x", "a1");
//        objBuilder.add("y", "a2");
//        arrBuilder.add(objBuilder);
//        
//        objBuilder = Json.createObjectBuilder();
//        objBuilder.add("x", "b1");
//        objBuilder.add("y", "b2");
//        arrBuilder.add(objBuilder);
//        
//        System.out.println(arrBuilder.build().toString());
        List<String> list = new ArrayList<String>();
        list.add("1");
        list.add("2");
        list.add("3");
        System.out.println(list.remove("1"));
        System.out.println(list.remove("4"));
    }
}
