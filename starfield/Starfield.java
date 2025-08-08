import javax.swing.JFrame;
import java.awt.EventQueue;

public class Starfield extends JFrame {

    public Starfield() {
        initUI();
    }

    private void initUI() {
        add(new StarPanel());

        setTitle("Starfield Animation");
        setSize(1000, 1000); // Aumentado o tamanho para melhor visualização
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);
    }

    public static void main(String[] args) {
        EventQueue.invokeLater(() -> {
            Starfield ex = new Starfield();
            ex.setVisible(true);
        });
    }
}