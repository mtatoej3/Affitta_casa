package affitta_casa;


import affitta_casa.controller.ControllerManager;


public class App {
    public static void main(String[] args) {
        System.out.println("Hello World!");

        ControllerManager cm = new ControllerManager();

        cm.testUtente();
        
    }
}
