import subprocess
import sys

def main():
    while True:
        print("Iniciando servidor Flask...")
        server = subprocess.Popen([sys.executable, "main.py"], stderr=subprocess.PIPE)

        # Aguarde a saída do processo do servidor
        _, stderr = server.communicate()

        if b"Restarting with stat" not in stderr:
            # Se o servidor não estiver reiniciando, saia do loop
            break

        print("Reiniciando servidor Flask...")

if __name__ == "__main__":
    main()
